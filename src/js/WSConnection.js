export default class WSConnection {
    constructor() {
        this.url = null;
        this.ws = null;
        this.isConnected = false;

        this.onEvents = {}
    }

    connect(url) {
        this.url = url;
        this.ws = new WebSocket(`${url}`);

        this.ws.addEventListener('open', this.onOpen.bind(this));
        this.ws.addEventListener('close', this.onClose.bind(this));
        this.ws.addEventListener('message', this.onMessage.bind(this));
    }

    onOpen() {
        console.log('websocket opened');
        this.isConnected = true;
    }

    onClose() {
        console.log('websocket closed');
        this.isConnected = false;
    }

    onMessage(msg) {
        let data = JSON.parse(msg.data);

        console.log('websocket message recieved');
        console.log(data);
        console.log(this.onEvents[data.event]);

        // relay messsages to callbacks
        let callbacks = this.onEvents[data.event] || [];
        callbacks.forEach((c) => {
            console.log('calling back');
            c(data.data);
        })
    }

    onError() {
        console.log('websocket error');
    }

    send(event_name, data) {
        this.ws.send(JSON.stringify({
            event: event_name,
            data: data
        }));
    }

    on(event_name, callback) {
        if(!this.onEvents.hasOwnProperty(event_name)) {
            this.onEvents[event_name] = [];
        }

        this.onEvents[event_name].push(callback);

        console.log(this.onEvents);
    }

    remove(event_name, callback) {
        this.onEvents[event_name] = this.onEvents[event_name].filter((c) => c !== callback);
    }
}