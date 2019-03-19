import { Component } from '@angular/core';
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

  // uploaded file
  file: any
  
  //data exported to the csv
  data:any[] = []

  columnsToDisplay = [
    "Name",
    "Address",
    "Type",
    "Width",
    "Signed",
    "Max string length",
    "Factor",
    "Unit"
  ];

  constructor(private ngxXml2json: NgxXml2jsonService){}

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
    const obj = this.ngxXml2json.xmlToJson(xml);
    this.setData(obj)
  }

  setData(json){
    let attributes = "@attributes"
    console.log(json);
    
    //set the name
    for (let i = 0; i < json.Symbolconfiguration.NodeList.Node.Node.Node.length; i++) {
      this.data[i] = {Name: json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}
      this.data[i].Address = `ns=4;s=|var|3231C.${json.Symbolconfiguration.NodeList.Node[attributes].name}.${json.Symbolconfiguration.NodeList.Node.Node[attributes].name}.${json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}`
      this.lenzeToIxon(i, json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].type)
    }
    this.fileIsUploaded = true
    console.log(this.data);
    
  }

  lenzeToIxon(i, data){
    switch (data) {
      case "T_BOOL":
      this.data[i].Type = "bool"
        break;
      case "T_BYTE":
      this.data[i].Type = "int"
      this.data[i].Width = 8
        break;
      case "T_DINT":
        break;
      case "T_INT":
      this.data[i].Type = "int"
      this.data[i].Width = 16
        break;
      case "T_LREAL":
      this.data[i].Type = "float"
      this.data[i].Width = 64
        break;
      case "T_REAL":
      this.data[i].Type = "float"
      this.data[i].Width = 32
        break;
      case "T_STRING_60_":
      this.data[i].Type = "float"
      this.data[i].Width = 64
        break;
      case "T_TIME":
      this.data[i].Type = "niet ondersteund"
        break;
      case "T_UINT":
      this.data[i].Type = "int"
      this.data[i].Width = 16
        break;
      case "T_WORD":
      this.data[i].Type = "int"
      this.data[i].Width = 16
        break;
      case "T_OperationMode":
      this.data[i].Type = "int"
      this.data[i].Width = 16
        break;
      default:
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
    new Angular5Csv(this.data, "IXON", this.options)
  }
}
