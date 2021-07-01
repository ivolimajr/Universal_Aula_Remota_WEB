import { FormGroup } from "@angular/forms";
import { utilsBr } from "js-brasil";
import { Subscription } from "rxjs";
import { DisplayMessage, GenericValidator, ValidationMessages } from "../shared/validators/generic-form-validation";

export class ManagementBaseComponent {

    isLoading$;
    createForm: FormGroup;
    public subscriptions: Subscription[] = [];
    MASKS = utilsBr.MASKS;
    displayMessage: DisplayMessage = {};
    genericValidator: GenericValidator;
    validationMessages: ValidationMessages;

    constructor(){}

      isControlValid(controlName: string): boolean {
        const control = this.createForm.controls[controlName];
        return control.valid && (control.dirty || control.touched);
      }
    
      isControlInvalid(controlName: string): boolean {
        const control = this.createForm.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
      }
    
      controlHasError(validation, controlName): boolean {
        const control = this.createForm.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
      }
    
      isControlTouched(controlName): boolean {
        const control = this.createForm.controls[controlName];
        return control.dirty || control.touched;
      }     
}
