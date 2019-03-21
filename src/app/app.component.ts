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
  
  title = 'XMLtoCSV';

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
    "Factor",
    "Unit"
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
    console.log(this.json);
    
    //set the name
    for (let i = 0; i < this.json.Symbolconfiguration.NodeList.Node.Node.Node.length; i++) {
      this.data[i] = {Name: this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}
      this.data[i].Address = this.json.Symbolconfiguration.NodeList.Node[attributes].name + "." + this.json.Symbolconfiguration.NodeList.Node.Node[attributes].name + "." +this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name
      this.lenzeToIxon(i, this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].type)
    }
    this.fileIsUploaded = true
  }
  // this needs to be better
  // type must look to typelist and get the iecname or something
  lenzeToIxon(i, nodeType){
    let attributes = "@attributes"
    var iecname
    switch(nodeType){
      case this.json.Symbolconfiguration.TypeList.TypeSimple[0][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[0][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[1][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[1][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[2][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[2][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[3][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[3][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[4][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[4][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[5][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[5][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[6][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[6][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[7][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[7][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[8][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[8][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeSimple[9][attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeSimple[9][attributes].iecname
        break;
      case this.json.Symbolconfiguration.TypeList.TypeUserDef[attributes].name:
      iecname = this.json.Symbolconfiguration.TypeList.TypeUserDef[attributes].iecname
        break;
    }
    switch (iecname) {
      case "BOOL":
      this.data[i].Type = "bool"
        break;
      case "BYTE":
      this.data[i].Type = "int"
      this.data[i].Width = 8
        break;
      case "DINT":
      this.data[i].Type = "int"
      this.data[i].Width = 16
        break;
      case "INT":
      this.data[i].Type = "int"
      this.data[i].Width = 16
        break;
      case "LREAL":
      this.data[i].Type = "float"
      this.data[i].Width = 64
        break;
      case "REAL":
      this.data[i].Type = "float"
      this.data[i].Width = 32
        break;
      case "STRING(60)":
      this.data[i].Type = "float"
      this.data[i].Width = 64
        break;
      case "TIME":
      this.data[i].Type = "niet ondersteund"
        break;
      case "UINT":
      this.data[i].Type = "Uint"
      this.data[i].Width = 16
        break;
      case "WORD":
      this.data[i].Type = "Uint"
      this.data[i].Width = 16
        break;
      case "OperationMode":
      this.data[i].Type = "int"
      this.data[i].Width = 16
        break;
      default:
      window.alert("Error: Unknown variable found")
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
      "Factor",
      "Unit"
    ],
    showTitle: false,
    useBom: false,
    nullToEmptyString: true
  };
  Download(){
    // create the address before the download
    let attributes = "@attributes"

    for (let i = 0; i < this.json.Symbolconfiguration.NodeList.Node.Node.Node.length; i++) {
      this.data[i].Address = `ns=${this.Address.value.Namespace};${this.Address.value.IdentifierType}=${this.Address.value.Identifier}.${this.json.Symbolconfiguration.NodeList.Node[attributes].name}.${this.json.Symbolconfiguration.NodeList.Node.Node[attributes].name}.${this.json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}`
    }
    new Angular5Csv(this.data, "IXON", this.options)
  }
}
