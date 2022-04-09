import { LightningElement, api } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends LightningElement {
    // Private
    boatId;
    error;
    boatReviews;
    isLoading;
    
    // Getter and Setter to allow for logic to run on recordId change
    @api get recordId() {
        return this.boatId;
    }

    set recordId(value) {
      //sets boatId attribute
      //sets boatId assignment
      //get reviews associated with boatId
        this.setAttribute('boatId', value);
        this.boatId = value;
        console.log('boatId:', this.boatId);
        this.getReviews(this.boatId);
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() {
        if (this.boatReviews !== null && this.boatReviews !== undefined && this.boatReviews.length) {
            console.log('There are reviews!');
            return true;
        } else {
            console.log('There are no reviews!');
            return false;
        }
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api refresh() {
        this.getReviews(this.boatId);
    }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews(boatId) {
        if (!boatId) {
            return;
        }
        this.isLoading = true;
        getAllReviews({boatId})
        .then(result => {
            this.boatReviews = result;
            console.log('this.boatReviews:', JSON.parse(JSON.stringify(this.boatReviews)));
        })
        .catch(error => {
            console.log('Error:', error);
            this.error = error;
        })
        .finally(() => {
            this.isLoading = false;
        });
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  }
  }