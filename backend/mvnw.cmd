@echo off
if exist "C:\Program Files\Apache NetBeans\java\maven\bin\mvn.cmd" (
    "C:\Program Files\Apache NetBeans\java\maven\bin\mvn.cmd" %*
) else (
    mvn %*
)
