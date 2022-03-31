import {Bug, Device, SearchIndexEntry, Tester, TesterDeviceMapping} from "./intefaces";

export class Datastore {

    private testerIdToTesterMap: Map<string, Tester> = new Map();
    private countries: Set<string> = new Set();
    private searchIndex: SearchIndexEntry[] = [];

    constructor(private devices: Device[], testers: Tester[], bugs: Bug[], devicesToTesters: TesterDeviceMapping[]) {
        testers.forEach(tester => {
            this.testerIdToTesterMap.set(tester.testerId, tester);
            if (!this.countries.has(tester.country)) {
                this.countries.add(tester.country);
            }
        });
        // Build search index
        const devicesToTesterResolvedBugs = new Map<string, Map<string, number>>();
        bugs.forEach(bug => {
            let statsForDevice: Map<string, number>;
            if (!devicesToTesterResolvedBugs.has(bug.deviceId)) {
                statsForDevice = new Map();
                devicesToTesterResolvedBugs.set(bug.deviceId, statsForDevice);
            } else {
                statsForDevice = devicesToTesterResolvedBugs.get(bug.deviceId) as Map<string, number>;
            }
            if (!statsForDevice.has(bug.testerId)) {
                statsForDevice.set(bug.testerId, 1);
            } else {
                statsForDevice.set(bug.testerId, statsForDevice.get(bug.testerId) as number + 1)
            }
        });
        // Add users that did not resolve bugs for own devices
        devicesToTesters.forEach(mapping => {
            let statsForDevice: Map<string, number>;
            if (!devicesToTesterResolvedBugs.has(mapping.deviceId)) {
                statsForDevice = new Map();
                devicesToTesterResolvedBugs.set(mapping.deviceId, statsForDevice);
            } else {
                statsForDevice = devicesToTesterResolvedBugs.get(mapping.deviceId) as Map<string, number>;
            }
            if (!statsForDevice.has(mapping.testerId)) {
                statsForDevice.set(mapping.testerId, 0);
            }
        });
        // create index itself
        devicesToTesterResolvedBugs.forEach((testerIdToBugsNumberMap, deviceId) => {
            testerIdToBugsNumberMap.forEach((resolvedBugsCount, testerId) => {
                if (this.testerIdToTesterMap.has(testerId)) {
                    this.searchIndex.push({
                        deviceId,
                        testerId,
                        resolvedBugsCount,
                        country: this.testerIdToTesterMap.get(testerId)!.country
                    });
                }
            });
        });
    }

    search(countries: string[], devices: string[]) {
        const countriesSet = new Set(countries);
        const devicesSet = new Set(devices);
        const indexProcessingResult: Map<string, number> = new Map(); // testerId => numberOfResolvedBugs
        this.searchIndex.forEach(indexEntry => {
            const countryMatched = countriesSet.has(indexEntry.country);
            const deviceMatched = devicesSet.has(indexEntry.deviceId);
            if (countryMatched && deviceMatched) {
                if (!indexProcessingResult.has(indexEntry.testerId)) {
                    indexProcessingResult.set(indexEntry.testerId, indexEntry.resolvedBugsCount);
                } else {
                    indexProcessingResult.set(indexEntry.testerId,
                        indexProcessingResult.get(indexEntry.testerId) as number + indexEntry.resolvedBugsCount);
                }
            }
        });
        return Array.from(indexProcessingResult.entries()).map(([testerId, numberOfBugsResolved]) => {
            const tester = this.testerIdToTesterMap.get(testerId) as Tester;
            return {
                testerName: `${tester.firstName} ${tester.lastName}`,
                country: tester.country,
                numberOfBugsResolved,
            };
        }).sort((a, b) => b.numberOfBugsResolved - a.numberOfBugsResolved);

    }

    getDevices(): Device[] {
        return this.devices.slice().sort((a, b) => a.description.localeCompare(b.description));
    }

    getCountries(): string[] {
        return Array.from(this.countries);
    }
}