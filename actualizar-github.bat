@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Actualizar CMR en GitHub

set "REPO_DIR=%~dp0"
cd /d "%REPO_DIR%" || goto :repo_error

where git >nul 2>&1 || goto :git_error
git rev-parse --is-inside-work-tree >nul 2>&1 || goto :repo_error
git remote get-url origin >nul 2>&1 || goto :remote_error
git config --get user.name >nul 2>&1 || goto :identity_error
git config --get user.email >nul 2>&1 || goto :identity_error

for /f "delims=" %%B in ('git branch --show-current') do set "CURRENT_BRANCH=%%B"
if /I not "!CURRENT_BRANCH!"=="main" goto :branch_error
for /f "delims=" %%R in ('git remote get-url origin') do set "REMOTE_URL=%%R"

if exist ".git\index.lock" goto :state_error
if exist ".git\rebase-apply" goto :state_error
if exist ".git\rebase-merge" goto :state_error
if exist ".git\MERGE_HEAD" goto :state_error

echo.
echo =============================================================
echo   Creative Maximum Reasoning - Actualizar GitHub
echo =============================================================
echo   Repositorio: "%REPO_DIR%"
echo   Rama: main
echo   Remoto: !REMOTE_URL!
echo.

echo [1/8] Comprobando acceso a GitHub...
git ls-remote --exit-code origin refs/heads/main >nul 2>&1
if errorlevel 1 goto :remote_access_error

echo [2/8] Detectando todos los cambios del sitio...
git status --short

echo [3/8] Incluyendo archivos creados, modificados y eliminados...
git add -A -- .
if errorlevel 1 goto :stage_error

git diff --cached --quiet
set "DIFF_CODE=!errorlevel!"
if !DIFF_CODE! GTR 1 goto :stage_error

if !DIFF_CODE! EQU 1 (
    for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "TIMESTAMP=%%T"
    set "COMMIT_MESSAGE=%~1"
    if not defined COMMIT_MESSAGE set "COMMIT_MESSAGE=sync: actualizar todos los cambios [!TIMESTAMP!]"
    echo.
    echo Archivos que se actualizaran:
    git diff --cached --name-status
    echo.
    echo [4/8] Creando commit...
    git commit -m "!COMMIT_MESSAGE!"
    if errorlevel 1 goto :commit_error
) else (
    echo [4/8] No hay cambios locales para crear un commit.
)

echo [5/8] Integrando cambios nuevos de origin/main...
git pull --rebase origin main
if errorlevel 1 goto :pull_error

echo [6/8] Subiendo main a GitHub...
git push origin main
if errorlevel 1 goto :push_error

echo [7/8] Verificando que el repositorio local quede limpio...
set "DIRTY_STATE="
for /f "delims=" %%S in ('git status --porcelain=v1 --untracked-files=all') do set "DIRTY_STATE=1"
if defined DIRTY_STATE goto :dirty_error

echo [8/8] Comparando el commit local con GitHub...
for /f "delims=" %%H in ('git rev-parse HEAD') do set "LOCAL_HEAD=%%H"
for /f "tokens=1" %%H in ('git ls-remote origin refs/heads/main') do set "REMOTE_HEAD=%%H"
if not defined REMOTE_HEAD goto :verify_error
if /I not "!LOCAL_HEAD!"=="!REMOTE_HEAD!" goto :verify_error

color 0a
echo.
echo =============================================================
echo   ACTUALIZACION COMPLETA
echo   Commit: !LOCAL_HEAD!
echo   Local y origin/main coinciden. No quedan cambios pendientes.
echo =============================================================
echo.
if not defined CMR_NO_PAUSE timeout /t 3 >nul 2>&1
exit /b 0

:git_error
set "ERROR_MESSAGE=Git no esta disponible en PATH."
goto :failure
:repo_error
set "ERROR_MESSAGE=No se encontro un repositorio Git valido en %REPO_DIR%."
goto :failure
:remote_error
set "ERROR_MESSAGE=El repositorio no tiene configurado el remoto origin."
goto :failure
:remote_access_error
set "ERROR_MESSAGE=No se pudo acceder a origin/main. Revisa Internet o el acceso a GitHub. No se creo ningun commit nuevo."
goto :failure
:identity_error
set "ERROR_MESSAGE=Git no tiene configurados user.name y user.email para crear commits."
goto :failure
:branch_error
set "ERROR_MESSAGE=La rama activa es !CURRENT_BRANCH!. Debe ser main."
goto :failure
:state_error
set "ERROR_MESSAGE=Git tiene un bloqueo, merge o rebase pendiente. Se detuvo sin borrar ni abortar nada."
goto :failure
:stage_error
set "ERROR_MESSAGE=No se pudieron preparar todos los cambios con git add -A."
goto :failure
:commit_error
set "ERROR_MESSAGE=No se pudo crear el commit."
goto :failure
:pull_error
set "ERROR_MESSAGE=El pull --rebase fallo. Tus archivos siguen seguros; revisa el conflicto antes de volver a ejecutar."
goto :failure
:push_error
set "ERROR_MESSAGE=No se pudo subir main a GitHub. El commit local sigue guardado y puede reintentarse."
goto :failure
:dirty_error
set "ERROR_MESSAGE=La actualizacion termino con cambios locales pendientes."
goto :failure
:verify_error
set "ERROR_MESSAGE=No se pudo confirmar que HEAD coincida con origin/main."
goto :failure

:failure
color 0c
echo.
echo =============================================================
echo   ERROR: !ERROR_MESSAGE!
echo =============================================================
echo.
if not defined CMR_NO_PAUSE pause
exit /b 1
