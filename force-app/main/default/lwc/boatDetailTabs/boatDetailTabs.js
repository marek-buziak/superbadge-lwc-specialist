// Custom Labels Imports
// import labelDetails for Details
// import labelReviews for Reviews
// import labelAddReview for Add_Review
// import labelFullDetails for Full_Details
// import labelPleaseSelectABoat for Please_select_a_boat
import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { subscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails  from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
// Boat__c Schema Imports
// import BOAT_ID_FIELD for the Boat Id
// import BOAT_NAME_FIELD for the boat Name
import BOAT_ID_FIELD from "@salesforce/schema/Boat__c.Id";
import BOAT_NAME_FIELD from "@salesforce/schema/Boat__c.Name";
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
//   @api boatId;
    boatId;
  
  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredRecord;
  
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };

  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
      return this.wiredRecord.data ? "utility:anchor" : null;
  }
  
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() {
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
  }
  
  // Private
  subscription = null;

  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;

    @api get recordId() {
        return this.boatId;
    }

    set recordId(value) {
        // this.setAttribute('boatId', value);
        this.boatId = value;
    }
  
  // Subscribe to the message channel
//   subscribeMC() {
//     // local boatId must receive the recordId from the message
//   }
subscribeMC() {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.recordId) {
        console.log('returned');
        return;
    }
    // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
    this.subscription = subscribe(
        this.messageContext,
        BOATMC,
        (message) => { this.boatId = message.recordId; },
        { scope: APPLICATION_SCOPE }
    );

}
  
  // Calls subscribeMC()
  connectedCallback() {
      console.log('BOAT_FIELDS:', JSON.parse(JSON.stringify(BOAT_FIELDS)));
      this.subscribeMC();
  }
  
  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.boatId,
            objectApiName: 'Boat__c', // objectApiName is optional
            actionName: 'view'
        }
    });
  }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() {
    //   console.log("handleReviewCreated() fires!");
      this.template.querySelector('lightning-tabset').activeTabValue = this.label.labelReviews;
      this.template.querySelector('c-boat-reviews').refresh();
  }
}
