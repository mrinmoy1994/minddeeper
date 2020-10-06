import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from './popup/popup.component';
import { ThrowStmt } from '@angular/compiler';
import { element } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  data: any;
  cols = 10;
  rows = 10;
  newArr = new Array(this.cols);
  valueArr = new Array(this.cols);
  blur = false;
  count = 0;
  clickNumberCount = 0;
  score = 0;

  constructor(private el: ElementRef, private modalService: NgbModal) {}

  ngOnInit() {
    this.createMine();
  }

  createMine() {
    this.score = 0;
    this.clickNumberCount = 0;
    this.count = 0;
    this.blur = false;
    for (let x = 0; x < this.rows; x++) {
      this.newArr[x] = [];
      for (let y = 0; y < this.cols; y++) {
        this.newArr[x][y] = Math.floor(Math.random() * 5);
      }
    }

    for (let x = 0; x < this.rows; x++) {
      this.valueArr[x] = [];
      for (let y = 0; y < this.cols; y++) {
        if (this.newArr[x][y] !== 0) {
          this.count++;
          this.valueArr[x][y] = {
            value: this.getDIstance(this.getAdjacentElements(x, y)),
            isVisible: false,
          };
        } else {
          this.valueArr[x][y] = { value: -1, isVisible: false };
        }
      }
    }
  }

  getAdjacentElements(index1, index2) {
    const values: { data: number; x: number; y: number }[] = [];
    const x = index1 - 1;
    const y = index2 - 1;

    for (let i = x; i <= x + 2; i++) {
      if (i >= 0 && i < this.rows) {
        for (let j = y; j <= y + 2; j++) {
          if (j >= 0 && j < this.cols) {
            values.push({ data: this.newArr[i][j], x: i, y: j });
          }
        }
      }
    }
    return values;
  }

  showAdjacentElements(index1, index2) {
    const values: { x: number; y: number }[] = [];
    const x = index1 - 1;
    const y = index2 - 1;

    for (let i = x; i <= x + 2; i++) {
      if (i >= 0 && i < this.rows) {
        for (let j = y; j <= y + 2; j++) {
          if (j >= 0 && j < this.cols) {
            values.push({ x: i, y: j });
          }
        }
      }
    }
    return values;
  }

  getDIstance(values: { data: number; x: number; y: number }[]) {
    let count = 0;
    values.forEach((element) => {
      if (
        0 <= element.x &&
        element.x < this.rows &&
        0 <= element.y &&
        element.y < this.cols &&
        element.data === 0
      ) {
        count++;
      }
    });
    return count;
  }
  onClickMine(index1, index2, type) {
    this.clickNumberCount = this.clickNumberCount - 1;
    this.blur = true;
    this.data = this.newArr[index1][index2];
    const modalRef = this.modalService.open(PopupComponent, {
      backdrop: 'static',
      size: 'sm',
      keyboard: false,
      centered: true,
      windowClass: 'modal_container',
    });
    modalRef.componentInstance.showWinner = type;
    modalRef.componentInstance.score = this.clickNumberCount;
    modalRef.componentInstance.confirmation.subscribe((res) => {
      modalRef.close();
      this.createMine();
      this.data = -1;
    });
  }

  onClickNumber(index1, index2) {
    this.data = this.valueArr[index1][index2];
    if (!this.data.isVisible) {
      this.clickNumberCount++;
      if (this.clickNumberCount === this.count) {
        this.onClickMine(index1, index2, true);
      }
      if (this.data.value === 0) {
        this.data.isVisible = true;
        this.showAdjacentElements(index1, index2).forEach((ele) => {
          this.onClickNumber(ele.x, ele.y);
        });
      } else if (this.data.value !== -1) {
        this.data.isVisible = true;
      } else {
        this.valueArr.forEach((row) => {
          row.forEach((elem) => {
            elem.isVisible = true;
          });
        });
        this.onClickMine(index1, index2, false);
      }
    }
  }
}
