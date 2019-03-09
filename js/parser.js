/// code for HTML parser

Parser = ()=>{
  
    this.parser = new DOMParser();

    this.getDocument = (htmlContent)=>{
       return parser.parseFromString(htmlContent, "text/html");
    }

    return {
        getDocument:getDocument
    }
}