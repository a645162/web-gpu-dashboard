import {MachineListItem} from './type/MachineListItem.ts';

import jsonMachine from '../assets/machineList.json';
import jsonMachineTest from '../assets/machineListTest.json';
import jsonMachineTemplate from '../assets/machineListTemplate.json';

const jsonMachineListData: MachineListItem[] =
    jsonMachine.machineList;
const jsonMachineListTestData: MachineListItem[] =
    jsonMachineTest.machineList;
const jsonMachineListTemplateData: MachineListItem[] =
    jsonMachineTemplate.machineList;

console.log('jsonMachineListData', jsonMachineListData);
console.log('jsonMachineListTestData', jsonMachineListTestData);
console.log('jsonMachineListTemplateData', jsonMachineListTemplateData);

// Combine the two lists
export const machineList: MachineListItem[] =
    jsonMachineListData
        .concat(jsonMachineListTestData)
        .concat(jsonMachineListTemplateData);
