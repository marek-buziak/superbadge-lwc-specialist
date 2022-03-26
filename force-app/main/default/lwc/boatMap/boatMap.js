// import BOATMC from the message channel
import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { subscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import LONGITUDE_FIELD from '@salesforce/schema/Boat__c.Geolocation__Longitude__s';
import LATITUDE_FIELD from '@salesforce/schema/Boat__c.Geolocation__Latitude__s';
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];
// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
// Declare the const LATITUDE_FIELD for the boat's Latitude
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
export default class BoatMap extends LightningElement {

    // connectedCallback() {
    //     console.log('BOATMC:', JSON.parse(JSON.stringify(BOATMC)));
    //     console.log('BOAT_FIELDS:', JSON.parse(JSON.stringify(BOAT_FIELDS)));
    // }
    

    // private
    subscription = null;
    @api boatId;

    // Getter and Setter to allow for logic to run on recordId change - prawdopodobnie zmiana musi nastąpić w komponencie nadrzędnym, po wyborze tile'a z daną łodzią
    // this getter must be public
    @api get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

  error = undefined;
  mapMarkers = [];

    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;

  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord, { recordId: '$boatId', BOAT_FIELDS })
  wiredRecord({ error, data }) {
    // Error handling
    if (data) {
        console.log('data ok');
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
    //   console.log('longitude:', longitude);
    //   console.log('latitude:', latitude);
      this.updateMap(longitude, latitude);
    } else if (error) {
        console.log('data false');
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

//   // Subscribes to the message channel
    subscribeMC() {
        // recordId is populated on Record Pages, and this component
        // should not update when this component is on a record page.
        if (this.subscription || this.recordId) {
            console.log('returned');
            return;
        }
        // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
        console.log('subscribe from subscribeMC');
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => this.handleMessage(message),
            { scope: APPLICATION_SCOPE }
        );

        // console.log('this.subscription:', JSON.parse(JSON.stringify(this.subscription)));
    }

    // Calls subscribeMC()
    connectedCallback() {
        this.subscribeMC();
    }

    // Handler for message received by component
    handleMessage(message) {
        this.boatId = message.recordId;
        console.log('this.boatId from handleMessage:', JSON.parse(JSON.stringify(this.boatId)));
    }

//   // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
      console.log('Longitude:');
      console.log('Latitude:');
  }

//   // Getter method for displaying the map component, or a helper method.
//   get showMap() {
//     return this.mapMarkers.length > 0;
//   }
}