import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../../_metronic/core/';
import KTLayoutExamples from '../../../../assets/js/layout/extended/examples';

@Component({
  selector: 'app-builder',
  templateUrl: './edriving.component.html',
  styleUrls: ['./edriving.component.scss'],
})
export class EdrivingComponent implements OnInit, AfterViewInit {
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  activeTabId = 1;
  constructor(private layout: LayoutService, private el: ElementRef) {}

  ngOnInit(): void {
    this.model = this.layout.getConfig();
  }

  ngAfterViewInit() {
    // init code preview examples
    // see /src/assets/js/layout/extended/examples.js
    const elements = this.el.nativeElement.querySelectorAll('.example');
    KTLayoutExamples.init(elements);
  }
}
