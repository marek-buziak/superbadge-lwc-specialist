// imports
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import BOAT_REVIEW_OBJECT from schema - BoatReview__c
// import NAME_FIELD from schema - BoatReview__c.Name
// import COMMENT_FIELD from schema - BoatReview__c.Comment__c
import BOAT_REVIEW_OBJECT from "@salesforce/schema/BoatReview__c";
import NAME_FIELD from "@salesforce/schema/BoatReview__c.Name";
import COMMENT_FIELD from "@salesforce/schema/BoatReview__c.Comment__c";
const SUCCESS_TITLE = "Review Created!";
const SUCCESS_VARIANT = "success";
export default class BoatAddReviewForm extends LightningElement {
    @api selectedBoatId;
    // Private
    boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField        = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    
    // Public Getter and Setter to allow for logic to run on recordId change
    @api get recordId() {
        return this.boatId;
    }

    set recordId(value) {
      //sets boatId attribute
      //sets boatId assignment
        this.setAttribute('boatId', value);
        this.boatId = value;
    }
    
    // Gets user rating input from stars component
    handleRatingChanged(event) {
        console.log('event.detail rating change:', JSON.parse(JSON.stringify(event.detail)));
        this.rating = event.detail.rating;
    }
    
    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
        event.preventDefault();
        console.log("this.selectedBoatId:", this.selectedBoatId);
        const fields = {...event.detail.fields, Boat__c: this.selectedBoatId, Rating__c: this.rating};
        console.log('fields to submit:', JSON.parse(JSON.stringify(fields)));
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
        console.log('handleSuccess fires!');
      // TODO: dispatch the custom event and show the success message
        const event = new ShowToastEvent({
            title: SUCCESS_TITLE,
            variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(event);

        const createReviewEvent = new CustomEvent('createreview');
        this.dispatchEvent(createReviewEvent);

        this.handleReset();
    }

    handleError(event) {
        console.log("Error:", JSON.parse(JSON.stringify(event)))
    }
    
    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() {
        console.log('handleReset fires!');
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
  }