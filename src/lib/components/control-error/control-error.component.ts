import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-control-error',
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.scss'],
})
export class ControlErrorComponent implements OnInit {

  _text: string ='';
  _hide = true;
  @Input() set text(value: string) {
    // eslint-disable-next-line no-underscore-dangle
    if (value !== this._text) {
      // eslint-disable-next-line no-underscore-dangle
      this._text = value;
      // eslint-disable-next-line no-underscore-dangle
      this._hide = !value;
      this.cdr.detectChanges();
    }
  }
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
