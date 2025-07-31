# PowerShell script để validate và format proto files
# Sử dụng buf để lint, format và check breaking changes

param(
    [switch]$SkipBreakingCheck
)

Write-Host "🔍 Validating proto files..." -ForegroundColor Green

# Di chuyển đến thư mục proto-definitions
Set-Location "libs/proto-definitions"

try {
    # Lint proto files
    Write-Host "📋 Linting proto files..." -ForegroundColor Yellow
    buf lint
    if ($LASTEXITCODE -ne 0) {
        throw "Linting failed"
    }

    # Format proto files
    Write-Host "🎨 Formatting proto files..." -ForegroundColor Yellow
    buf format -w
    if ($LASTEXITCODE -ne 0) {
        throw "Formatting failed"
    }

    # Check for breaking changes (nếu có git history và không skip)
    if (-not $SkipBreakingCheck) {
        $mainBranchExists = git rev-parse --verify main 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🚨 Checking for breaking changes..." -ForegroundColor Yellow
            buf breaking --against '.git#branch=main'
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Breaking changes detected!" -ForegroundColor Red
                Write-Host "Please review the changes and update version if necessary." -ForegroundColor Red
                exit 1
            }
        }
    }

    # Generate files
    Write-Host "⚙️ Generating proto files..." -ForegroundColor Yellow
    buf generate
    if ($LASTEXITCODE -ne 0) {
        throw "Generation failed"
    }

    Write-Host "✅ Proto validation completed successfully!" -ForegroundColor Green

    # Kiểm tra xem có thay đổi gì không
    $changes = git status --porcelain
    if ($changes) {
        Write-Host "📝 Changes detected in generated files:" -ForegroundColor Cyan
        Write-Host $changes -ForegroundColor Yellow
        Write-Host "💡 Please commit the generated files if needed." -ForegroundColor Cyan
    } else {
        Write-Host "✨ No changes detected in generated files." -ForegroundColor Green
    }

} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Quay lại thư mục gốc
    Set-Location "../.."
} 