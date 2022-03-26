import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;

    connectedCallback() {
        console.log('boatSearch component connected!');
    }
  
    // Handles loading event
    handleLoading(event) {
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading(event) {
        this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {
        // console.log('event - data from boatSearchForm component:', JSON.parse(JSON.stringify(event)));
        const selectedBoatTypeId = event.detail.boatTypeId;
        console.log('selectedBoatTypeId:', selectedBoatTypeId);
        this.template.querySelector('c-boat-search-results').searchBoats(selectedBoatTypeId);
    }
    
    createNewBoat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c '
            },
        });
    }
}