
// This "View Module" performs logging
export class ViewModule{
    private static log: string = "STARTUP - " + new Date().toLocaleString() + "\n"

    static displayText(str: string) {
        console.log(str)
    }

    static logError(errorText: string){
        let msg = "ERROR - " + new Date().toLocaleString() + ` : ${errorText}`
        this.log += msg + "\n"
        console.log(msg)
    }

    static logEvent(eventText: string){
        let msg = "EVENT - " + new Date().toLocaleString() + ` : ${eventText}`
        this.log += msg + "\n"
        console.log(msg)
    }

    static displayLog(){
        console.log(this.log)
    }
}