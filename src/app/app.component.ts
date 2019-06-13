import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  fileIsUploaded: boolean = false

  json: any

  // uploaded file
  file: any
  
  //data exported to the csv
  data:any[] = [

  ]

  columnsToDisplay = [
    "Name",
    "Namespace",
    "IdentifierType",
    "Identifier",
    "Type",
    "Width",
    "Signed",
    "Max string length",
  ];

  Address:any

  constructor(private ngxXml2json: NgxXml2jsonService, private fb: FormBuilder){
    //create form values
    this.Address = fb.group({
      'Namespace':[4],
      'IdentifierType':["s"],
      'Identifier':["|var|3231C"]
    })
  }  

  handleFileInput(evt){
    this.file = evt[0]

    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      this.xmlToJson(fileReader.result)
    }
    fileReader.readAsText(this.file);
  }
  
  xmlToJson(xmltext){
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmltext, 'text/xml');
    this.json = this.ngxXml2json.xmlToJson(xml);
    this.setData()
  }

  setData(){
    let attributes = "@attributes"
    this.data = []
    //set the name
    console.log(this.json);
    if (this.json.Symbolconfiguration.NodeList.Node.Node instanceof Array) {
      for (let n = 0; n < this.json.Symbolconfiguration.NodeList.Node.Node.length; n++) {
        for (let i = 0; i < this.json.Symbolconfiguration.NodeList.Node.Node[n].Node.length; i++) {
          // Variable name
          this.data[i] = {Name: this.json.Symbolconfiguration.NodeList.Node.Node[n].Node[i][attributes].name}
          // Variable Address
          this.data[i].Address = this.json.Symbolconfiguration.NodeList.Node[attributes].name + "." + this.json.Symbolconfiguration.NodeList.Node.Node[n][attributes].name + "." +this.json.Symbolconfiguration.NodeList.Node.Node[n].Node[i][attributes].name
            // look for the matching name with the type
            for (let m = 0; m < this.json.Symbolconfiguration.TypeList.TypeSimple.length; m++) {
              if (this.json.Symbolconfiguration.NodeList.Node.Node[n].Node[i][attributes].type == this.json.Symbolconfiguration.TypeList.TypeSimple[m][attributes].name) {
                var iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[m][attributes].iecname
              }else{
                for (let x = 0; x < this.json.Symbolconfiguration.TypeList.TypeUserDef.length; x++) {
                  if(this.json.Symbolconfiguration.NodeList.Node.Node[n].Node[i][attributes].type == this.json.Symbolconfiguration.TypeList.TypeUserDef[x][attributes].name){
                    var iecname = this.json.Symbolconfiguration.TypeList.TypeUserDef[x][attributes].iecname
                  }
                } 
              }
            }
          this.lenzeToIxon(i, iecname)
        }
      }
    }else{
      for (let i = 0; i < this.json.Symbolconfiguration.NodeList.Node.Node.Node.length; i++) {
        this.data[i] = {Name: this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}
        this.data[i].Address = this.json.Symbolconfiguration.NodeList.Node[attributes].name + "." + this.json.Symbolconfiguration.NodeList.Node.Node[attributes].name + "." +this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name
          for (let g = 0; g < this.json.Symbolconfiguration.TypeList.TypeSimple.length; g++) {
            if (this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].type == this.json.Symbolconfiguration.TypeList.TypeSimple[g][attributes].name) {
              var iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[g][attributes].iecname
            }else{
              if (this.json.Symbolconfiguration.TypeList.TypeUserDef instanceof Array) {
                for (let x = 0; x < this.json.Symbolconfiguration.TypeList.TypeUserDef.length; x++) {
                  if(this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].type == this.json.Symbolconfiguration.TypeList.TypeUserDef[x][attributes].name){
                    var iecname = this.json.Symbolconfiguration.TypeList.TypeUserDef[x][attributes].iecname
                  }
                } 
              }else{
                if(this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].type == this.json.Symbolconfiguration.TypeList.TypeUserDef[attributes].name){
                  var iecname = this.json.Symbolconfiguration.TypeList.TypeUserDef[attributes].iecname
                }
              }
            }
          }
        this.lenzeToIxon(i, iecname)
      }
    }
    this.fileIsUploaded = true
  }
  // We need the iecname so we search for it by name
  lenzeToIxon(i, iecname){
    let finalNumber
    if (iecname.substr(0, 7) == "STRING(") {
      finalNumber = iecname.match(/\d+/)[0]
    }
    switch (iecname) {
      case "BOOL":
      this.data[i].Type = "bool"
      this.data[i].Width = ""
        break;
      case "BYTE":
      this.data[i].Type = "int"
      this.data[i].Width = 8
      this.data[i].Signed = "TRUE"
        break;
      case "INT":
      this.data[i].Type = "int"
      this.data[i].Width = 16
      this.data[i].Signed = "TRUE"
        break;
        case "ENUM":
      this.data[i].Type = "int"
      this.data[i].Width = 16
      this.data[i].Signed = "TRUE"
        break;
        case "OperationMode":
      this.data[i].Type = "int"
      this.data[i].Width = 16
      this.data[i].Signed = "TRUE"
        break;
      case "DINT":
      this.data[i].Type = "int"
      this.data[i].Width = 32
      this.data[i].Signed = "TRUE"
        break;
      case "LINT":
      this.data[i].Type = "int"
      this.data[i].Width = 64
      this.data[i].Signed = "TRUE"
        break;
      case "LREAL":
      this.data[i].Type = "float"
      this.data[i].Width = 64
        break;
      case "REAL":
      this.data[i].Type = "float"
      this.data[i].Width = 32
        break;
      case "STRING":
      this.data[i].Type = "str"
      this.data[i].Width = ""
      this.data[i].Signed = ""
      this.data[i].MaxStringLength = 255
        break;
      case `STRING(${finalNumber})` :
      this.data[i].Type = "str"
      this.data[i].Width = ""
      this.data[i].Signed = ""
      this.data[i].MaxStringLength = finalNumber
        break;
      case "USINT":
      this.data[i].Type = "int"
      this.data[i].Width = 8
      this.data[i].Signed = "FALSE"
        break;
      case "UINT":
      this.data[i].Type = "int"
      this.data[i].Width = 8
      this.data[i].Signed = "FALSE"
        break;
      case "WORD":
      this.data[i].Type = "int"
      this.data[i].Width = 16
      this.data[i].Signed = "FALSE"
        break;
      case "DWORD":
      this.data[i].Type = "int"
      this.data[i].Width = 32
      this.data[i].Signed = "FALSE"
        break;
        case "UINT":
      this.data[i].Type = "int"
      this.data[i].Width = 32
      this.data[i].Signed = "FALSE"
        break;
      case "LWORD":
      this.data[i].Type = "int"
      this.data[i].Width = 64
      this.data[i].Signed = "FALSE"
        break;
      default:
      console.log(this.data[i]);
      
        this.data[i].Type = "Not supported"
        break;
    }
  }

  // Csv file options
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [
      "Name",
      "Address",
      "Type",
      "Width",
      "Signed",
      "Max string length",
    ],
    showTitle: false,
    useBom: false,
    nullToEmptyString: true
  };
  Download(){
    // create the address before the download
    console.log(this.data);
    
    let CSVfile = this.data.map(a => Object.assign({}, a))
    
    
    let attributes = "@attributes"
    if (this.json.Symbolconfiguration.NodeList.Node.Node instanceof Array) {
      for (let n = 0; n < this.json.Symbolconfiguration.NodeList.Node.Node.length; n++) {
        for (let i = 0; i < this.json.Symbolconfiguration.NodeList.Node.Node[n].Node.length; i++) {
          CSVfile[i].Unit = ""
          CSVfile[i].Address = `ns=${this.Address.value.Namespace};${this.Address.value.IdentifierType}=${this.Address.value.Identifier}.${this.json.Symbolconfiguration.NodeList.Node[attributes].name}.${this.json.Symbolconfiguration.NodeList.Node.Node[n][attributes].name}.${this.json.Symbolconfiguration.NodeList.Node.Node[n].Node[i][attributes].name}`
        }
      }
    }else{
      for (let i = 0; i < this.json.Symbolconfiguration.NodeList.Node.Node.Node.length; i++) {
        CSVfile[i].Unit = ""
        CSVfile[i].Address = `ns=${this.Address.value.Namespace};${this.Address.value.IdentifierType}=${this.Address.value.Identifier}.${this.json.Symbolconfiguration.NodeList.Node[attributes].name}.${this.json.Symbolconfiguration.NodeList.Node.Node[attributes].name}.${this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}`
      }
    }
    console.log(CSVfile);

    for (let i = 0; i < CSVfile.length; i++) {
      if (CSVfile[i].Type == "Not supported") {
        CSVfile.splice(i,1)
        i--
        console.log(CSVfile[i], "DELETED");
      }
    }
    console.log(CSVfile);
    
    new Angular5Csv(CSVfile, "IXON datasource", this.options)
  }
}
