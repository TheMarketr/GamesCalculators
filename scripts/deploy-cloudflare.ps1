$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$credentialPath = Join-Path $env:USERPROFILE '.codex\credentials\gamescalculators-cloudflare-pages.dpapi'
$accountId = 'b64795c0bf26e91d5d9bf1e10e4f37d5'

if (-not (Test-Path -LiteralPath $credentialPath)) {
    throw "Cloudflare deployment credential is not installed at $credentialPath"
}

$secureToken = Get-Content -LiteralPath $credentialPath -Raw | ConvertTo-SecureString
$tokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)

try {
    $plainToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($tokenPointer)
    $env:CLOUDFLARE_API_TOKEN = $plainToken
    $env:CLOUDFLARE_ACCOUNT_ID = $accountId
    $env:NODE_OPTIONS = '--max-old-space-size=1024'

    Push-Location $repositoryRoot
    try {
        pnpm build
        if ($LASTEXITCODE -ne 0) { throw 'Production build failed.' }

        $commitHash = git rev-parse HEAD
        pnpm dlx wrangler@4.126.0 pages deploy dist `
            --project-name=gamescalculators `
            --branch=main `
            --commit-dirty=true `
            --commit-hash=$commitHash
        if ($LASTEXITCODE -ne 0) { throw 'Cloudflare Pages deployment failed.' }
    }
    finally {
        Pop-Location
    }
}
finally {
    if ($tokenPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($tokenPointer)
    }
    Remove-Item Env:CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue
    Remove-Item Env:CLOUDFLARE_ACCOUNT_ID -ErrorAction SilentlyContinue
    Remove-Item Env:NODE_OPTIONS -ErrorAction SilentlyContinue
}
