import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from './popup/popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: any;
  cols = 10;
  rows = 10;
  newArr = new Array(this.cols);

constructor(private el: ElementRef, private modalService: NgbModal) {
}

ngOnInit() {
this.createMine();
}

createMine() {
  for (let x = 0; x < this.cols; x++){
    this.newArr[x] = [];
    for (let y = 0; y < this.rows; y++){
      this.newArr[x][y] = Math.floor(Math.random() * 5);
    }
  }
  console.table(this.newArr);
}

getAdjacentElements(index1, index2) {
  const topLeft  = this.newArr[ index1 - 1 ][ index2 - 1 ];
  const top      = this.newArr[ index1     ][ index2 - 1 ];
  const topRight = this.newArr[ index1 + 1 ][ index2 - 1 ];

  const midLeft  = this.newArr[ index1 - 1 ][ index2     ];
  const midRight = this.newArr[ index1 + 1 ][ index2     ];

  const botLeft  = this.newArr[ index1 - 1 ][ index2 + 1 ];
  const bot      = this.newArr[ index1     ][ index2 + 1 ];
  const botRight = this.newArr[ index1 + 1 ][ index2 + 1 ];
}
onClickMine(index1, index2) {
  this.data = this.newArr[index1][index2];
  const modalRef = this.modalService.open(PopupComponent, {
    backdrop: 'static',
    size: 'sm',
    keyboard: false,
    centered: true,
    windowClass: 'modal_container',
  });
  modalRef.componentInstance.confirmation.subscribe((res) => {
    modalRef.close();
    this.createMine();
    this.data = -1;
  });
}

onClickNumber(index1, index2) {
  this.data = this.newArr[index1][index2];
}
}
