@echo off
chcp 65001 > nul
title Sincronización CMR con GitHub
color 0b

echo.
echo  =============================================================
echo    Creative Maximum Reasoning (CMR) — Sincronizador a GitHub
echo  =============================================================
echo.

set "REPO_DIR=%~dp0"

echo [1/3] Verificando cambios remotos (git pull)...
git pull origin main --rebase

echo.
echo [2/3] Preparando archivos para commit (git add)...
git add -A

git diff --staged --quiet
if errorlevel 1 (
    echo [2b/3] Creando commit de sincronizacion...
    git commit -m "feat(v2): actualizar arquitectura modular CMR Web System v2 [%date% %time:~0,5%]"
    
    echo.
    echo [3/3] Subiendo cambios a GitHub (git push origin main)...
    git push origin main
    
    if errorlevel 1 (
        color 0c
        echo.
        echo  [ERROR] Fallo el comando git push. Revisa tus credenciales o conexion.
        echo.
    ) else (
        color 0a
        echo.
        echo  =============================================================
        echo    EXITO: Los cambios se subieron correctamente a GitHub!
        echo  =============================================================
        echo.
    )
) else (
    echo [INFO] No hay cambios nuevos para commitear. La web ya esta al dia en GitHub.
    echo.
)

echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
