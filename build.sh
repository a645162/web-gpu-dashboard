#!/bin/bash

# Check file is exist
if [ -f "src/assets/machineList.json" ]; then
    echo "machineList.json is exist"
else
    echo "machineList.json is not exist!"
    cp src/assets/machineListTemplate.json src/assets/machineList.json
fi

if [ -f "src/assets/machineListTest.json" ]; then
    echo "machineListTest.json is exist"
else
    echo "machineListTest.json is not exist!"
    cp src/assets/machineListTemplate.json src/assets/machineListTest.json
fi

bun install
bun run build
