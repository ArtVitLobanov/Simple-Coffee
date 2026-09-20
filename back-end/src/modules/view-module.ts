
// This "View Module" performs logging
export class ViewModule{
    private log: string
    constructor(){
        this.log = "STARTUP - " + new Date().toLocaleString() + "\n"
    }

    displayText(str: string) {
        console.log(str)
    }

    logError(errorText: string){
        let msg = "ERROR - " + new Date().toLocaleString() + ` : ${errorText}`
        this.log += msg + "\n"
        console.log(msg)
    }

    logEvent(eventText: string){
        let msg = "EVENT - " + new Date().toLocaleString() + ` : ${eventText}`
        this.log += msg + "\n"
        console.log(msg)
    }

    displayLog(){
        console.log(this.log)
    }
}