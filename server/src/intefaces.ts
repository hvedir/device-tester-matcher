export interface Tester {
    testerId: string;
    firstName: string;
    lastName: string;
    country: string;
    lastLogin: string;
}

export interface Device {
    deviceId: string;
    description: string;
}

export interface Bug {
    bugId: string;
    deviceId: string;
    testerId: string;
}

export interface TesterDeviceMapping {
    testerId: string;
    deviceId: string;
}

export interface SearchIndexEntry {
    resolvedBugsCount: number;
    deviceId: string;
    testerId: string;
    country: string;
}