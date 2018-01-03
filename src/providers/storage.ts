import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Profile } from '../model/profile';

@Injectable()
export class StorageProvider {
    private static STORAGE_KEY: string = 'mtpelerin';
    private storedData: Array<Profile> = [];
    private profileTemplate: Profile = {
        name: 'default',
        selected: true,
        settings: {},
        persisted: {
            accounts: [
                {
                    account: {},
                    balances: {
                        'EUR': 20000,
                        'USD': 10000
                    },
                    logs: []
                }
            ]
        }
    }
    private status = { loading: false, writing: false, error: null };

    constructor(private nativeStorage: NativeStorage) {
        this.status.loading = true;
        this.nativeStorage.getItem(StorageProvider.STORAGE_KEY).then(
            data => {
                this.status.loading = false;
                if (data) this.storedData = data;
                console.log('Found ' + this.storedData.length + ' stored profiles');
            },
            error => {
                this.status.loading = false;
                this.status.error = error;
                console.error('Error reading item', error);
            }
        );
    }

    public switchProfile(name: string): Profile {
        let selectedProfile: Profile;
        this.storedData.forEach(profile => {
            if(profile.name == name) {
                selectedProfile = profile;
            }
        })
        return selectedProfile;
    }

    public getProfileData(): Profile {
        let selectedProfile: Profile;
        this.storedData.forEach(profile => {
            if (profile.selected) {
                selectedProfile = profile;
            }
        });
        return selectedProfile;;
    }

    public persist() {
        this.status.writing = true;
        this.nativeStorage
            .setItem(StorageProvider.STORAGE_KEY, this.storedData).then(() => {
                this.status.writing = false;
                console.log('Stored item!')
            }, error => {
                this.status.writing = false;
                this.status.error = error;
                console.error('Error storing item', error)
            });
    }
}