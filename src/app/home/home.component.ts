import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbAlertConfig]
})
export class HomeComponent implements OnInit {
 loading = true;
    submitted = false;
  rows: any = [];
  temp: any = [];
  closeResult = '';
  alert = false;
  postRespose:any;
  
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns = [{ prop: 'manufacturerName' }, { name: 'description' }];
  constructor(private service: SharedService,private modalService: NgbModal,private formBuilder: FormBuilder,alertConfig: NgbAlertConfig) {
    alertConfig.type = 'success';
    alertConfig.dismissible = true;
  }
 registerForm = this.formBuilder.group({
    manufactureName: ['', Validators.required],
    description: ['', Validators.required],
   
});
  ngOnInit() {
    this.fetchData();
  
  }

  fetchData() {
    this.service.getData().subscribe((res) => {
      this.temp = res;
      this.rows = res;
      this.loading = false;
      console.log(this.temp);
    });
  }
  updateFilter(event:any) {
   
    const val = event.target.value.toLowerCase();
    
    // filter our data
    const temp = this.temp.filter(function (d:any) {
    
      return d.manufacturerName.toLowerCase().indexOf(val) != -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.loading=true
    console.log(this.registerForm.value.description)
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

   this.service.postData(this.registerForm.value.description, this.registerForm.value.manufactureName).subscribe(res=>{
   
    this.postRespose = res;
    console.log(this.postRespose.isSuccess)
    if(this.postRespose.isSuccess == true){
      this.fetchData();
      this.alert = true;
      this.loading=false
      this.registerForm.reset()
      setTimeout(()=>{                           // <<<---using ()=> syntax
        this.alert = false;
    }, 3000);
    }
   });
}

}
