# pack-skills.ps1 — Generates .zip files for each WPF3 skill for team distribution
# Usage: ./skills/pack-skills.ps1
# Output: skills/dist/*.zip

$skillsRoot = "$PSScriptRoot"
$distDir = "$skillsRoot\dist"

New-Item -ItemType Directory -Force $distDir | Out-Null

$skills = @("wpf3-framework", "wpf3-autofixer", "wpf3-bugs")

foreach ($skill in $skills) {
    $skillDir = "$skillsRoot\$skill"
    $zipPath = "$distDir\$skill.zip"

    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

    Compress-Archive -Path "$skillDir\*" -DestinationPath $zipPath
    Write-Host "Packed: $skill.zip"
}

Write-Host "`nDone. Files in: $distDir"
