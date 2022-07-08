import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http:HttpClient) { }
 
  
  getData(){
  return this.http.post("http://159.65.151.134/api/ManufacturerAPI/GetAll","")
  }
  postData(data:any,data1:any){


    return this.http.post("http://159.65.151.134/api/ManufacturerAPI/Post",   {"manufacturerName": data1,

    "description": data
  
  }
    )
    }
}
