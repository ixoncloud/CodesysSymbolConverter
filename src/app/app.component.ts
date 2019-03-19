import { Component } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'XMLtoCSV';

  // uploaded file
  file: any
  constructor(private ngxXml2json: NgxXml2jsonService){}

  //data exported to the csv
  data:any[] = []

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
      this.data[i] = {"Name": json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}
      this.data[i].Address = `ns=4;s=|var|3231C.${json.Symbolconfiguration.NodeList.Node[attributes].name}.${json.Symbolconfiguration.NodeList.Node.Node[attributes].name}.${json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].name}`
      this.data[i].Signed = ""
      this.data[i].Maxstringlength = ""
      this.data[i].Factor = ""
      this.data[i].Unit = ""
      this.lenzeToIxon(i, json.Symbolconfiguration.NodeList.Node.Node.Node[i][attributes].type)   
    }
  }

  lenzeToIxon(i, data){
    switch (data) {
      case "T_BOOL":
      this.data[i].Type = "bool"
      this.data[i].Width = ""
        break;
      case "T_BYTE":
      this.data[i].Type = "int"
      this.data[i].Width = 8
        break;
      case "T_DINT":
      this.data[i].Type = ""
      this.data[i].Width = ""
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
      this.data[i].Width = ""
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
    removeNewLines: true,
    keys: [
      "Name",
      "Address",
      "Type",
      "Width",
      "Signed",
      "Maxstringlength",
      "Factor",
      "Unit"
     ]
  };
}
