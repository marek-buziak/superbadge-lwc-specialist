// imports
import { LightningElement, api, wire } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
// import getSimilarBoats
export default class SimilarBoats extends LightningElement {
    // Private
    currentBoat;
    relatedBoats;
    boatId;
    error;

    // public
    @api get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
        console.log("this.boatId on recordPage:", this.boatId);
    }

    // public
    @api similarBy;

    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire(getSimilarBoats, { boatId: '$boatId', similarBy: '$similarBy'})
    similarBoats({ error, data }) {
        if (data) {
            this.relatedBoats = data;
            console.log("this.relatedBoats:", JSON.parse(JSON.stringify(this.relatedBoats)));
        } else if (error) {
            this.error = error;
            console.log('this.error:', this.error);
        }
    }
    get getTitle() {
        return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    // Navigate to record page
    openBoatDetailPage(event) { }
}
