$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$credentialPath = Join-Path $env:USERPROFILE '.codex\credentials\gamescalculators-cloudflare-worker.dpapi'

if (-not (Test-Path -LiteralPath $credentialPath)) {
    throw "Cloudflare Worker credential is not installed at $credentialPath"
}

$secureToken = Get-Content -LiteralPath $credentialPath -Raw | ConvertTo-SecureString
$tokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)

try {
    $env:CLOUDFLARE_API_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($tokenPointer)
    $env:CLOUDFLARE_ACCOUNT_ID = 'b64795c0bf26e91d5d9bf1e10e4f37d5'
    $env:NODE_OPTIONS = '--max-old-space-size=768'
    $env:GOMEMLIMIT = '512MiB'

    Push-Location $repositoryRoot
    try {
        pnpm dlx wrangler@4.126.0 deploy --config workers/reward-refresh/wrangler.jsonc
        if ($LASTEXITCODE -ne 0) { throw 'Reward Worker deployment failed.' }
    }
    finally {
        Pop-Location
    }
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($tokenPointer)
    Remove-Item Env:CLOUDFLARE_API_TOKEN,Env:CLOUDFLARE_ACCOUNT_ID,Env:NODE_OPTIONS,Env:GOMEMLIMIT -ErrorAction SilentlyContinue
}
