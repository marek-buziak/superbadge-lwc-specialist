import { LightningElement, api, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  // columns = [];
  columns = [
      {label: "Name", fieldName: "Name", type: "text", editable: true},
      {label: "Length", fieldName: "Length__c", type: "number", editable: true},
      {label: "Price", fieldName: "Price__c", type: "currency", typeAttributes: { currencyCode: "USD" }, editable: true},
      {label: "Description", fieldName: "Description__c", type: "text", editable: true}
  ];
  boatTypeId = '';
  boats;
  isLoading = false;
  
  // wired message context
    @wire(MessageContext)
    messageContext;

  // wired getBoats method
  @wire(getBoats, {boatTypeId: '$boatTypeId'})
  wiredBoats({error, data}) {
    if (data) {
        this.boats = data;
    } else if (error) {
    }
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api searchBoats(boatTypeId) {
      this.isLoading = true;
      this.notifyLoading(this.isLoading);
      this.boatTypeId = boatTypeId;
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  // ---> See "Boat Editor–Edit Boats En Masse!" 
  @api async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
      this.selectedBoatId = event.detail.boatId;
      this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
    const payload = { recordId: boatId };
    publish(this.messageContext, BOATMC, payload);
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then(() => {
        const event = new ShowToastEvent({
            title: SUCCESS_TITLE,
            variant: SUCCESS_VARIANT,
            message: MESSAGE_SHIP_IT
        });
        this.dispatchEvent(event);
        this.refresh();
    })
    .catch(error => {
        const event = new ShowToastEvent({
            title: ERROR_TITLE,
            variant: ERROR_VARIANT
        });
        this.dispatchEvent(event);
    })
    .finally(() => {
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
      if (isLoading) {
        this.dispatchEvent(new CustomEvent('loading'));
      } else {
          // setTimeout tylko dla testów - ostatecznie do usunięcia
        setTimeout(() => {this.dispatchEvent(new CustomEvent('doneloading'));}, 2000);
      }
  }
}