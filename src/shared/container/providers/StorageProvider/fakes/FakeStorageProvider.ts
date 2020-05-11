import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
    private fakeStorage: string[] = [];

    public async saveFile(file: string): Promise<string> {
        this.fakeStorage.push(file);
        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        const fileIndex = this.fakeStorage.findIndex(
            fakeFile => fakeFile === file,
        );

        this.fakeStorage.splice(fileIndex, 1);
    }
}
