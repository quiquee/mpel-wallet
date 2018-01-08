import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../model/profile';
import { Storage } from '@ionic/storage';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class ProfileProvider {
    private static STORAGE_KEY='mtpelerin';
    private profileSubject: ReplaySubject<Profile>;

    constructor(private storage: Storage) {
        this.profileSubject = new ReplaySubject();
        this.storage.get(ProfileProvider.STORAGE_KEY).then(profile =>
            this.profileSubject.next(profile)
        );  
     }

    public newProfile() {
        let profile = new Profile();
        profile.name = 'default';
        this.storage.set(ProfileProvider.STORAGE_KEY, profile);
        this.profileSubject.next(profile)
    }

    public clearProfile() {
        this.storage.remove(ProfileProvider.STORAGE_KEY);
        this.profileSubject.next(null);
    }

    public getProfile(): Observable<Profile> {
        return this.profileSubject;
    }
}
