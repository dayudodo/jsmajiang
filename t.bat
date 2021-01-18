@REM REM 此批处理专门用来跑服务器测试
@REM REM 有一些测试需要编译好TS文件，即在根目录下运行tsc
@REM REM 所有的测试项目都保存在此

@REM 计时器的测试有点儿不一样！
node server_build\spec\simulate\timerTest.js

@REM node_modules\.bin\ava spec\simulate\GangRoomConfirmTest.ts REM OK
@REM node_modules\.bin\ava spec\simulate\huConfirmInRoomTest.ts
