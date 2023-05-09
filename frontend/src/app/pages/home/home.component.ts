import { Component } from '@angular/core';
import { ConnectionService } from 'src/app/utils/connection.service';
import { Pet } from 'src/models/pet.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  petsArray: Pet[] = [];
  newPetType = '';
  newPetName = '';

  constructor (private connectionService: ConnectionService) {

  }

  ngOnInit() {
    this.updatePetsArray();
  }

  updatePetsArray() {
    this.connectionService.getPets().subscribe(result => {
      while (this.petsArray.length > 0) {
        this.petsArray.pop();
      }

      (result as any).forEach((element: any) => {
        const tmpPet = new Pet(element.id, element.petName, element.petType);
        this.petsArray.push(tmpPet);
      });
    }, error => {
      console.log(error);
    });
  }

  deletePet(id: string) {
    this.connectionService.deletePet(id).subscribe(result => {
      this.updatePetsArray();
    }, error => {
      console.log(error);
    });
  }

  newPet() {
    if (this.newPetName != '' && this.newPetType != '') {
      this.connectionService.newPet(this.newPetType, this.newPetName).subscribe(result => {
        this.updatePetsArray();
        this.newPetName = '';
        this.newPetType = '';
      }, error => {
        console.log(error);
      });
    }
  }

  updatePet(id: string, currentPetName: string, currentPetType: string) {
    if (this.newPetName != '' && this.newPetType != '') {
      this.connectionService.updatePet(id, this.newPetType, this.newPetName).subscribe(result => {
        this.updatePetsArray();
        this.newPetName = '';
        this.newPetType = '';
      }, error => {
        console.log(error);
      });
    } else if (this.newPetName != '') {
      this.connectionService.updatePet(id, currentPetType, this.newPetName).subscribe(result => {
        this.updatePetsArray();
        this.newPetName = '';
        this.newPetType = '';
      }, error => {
        console.log(error);
      });
    } else if (this.newPetType != '') {
      this.connectionService.updatePet(id, this.newPetType, currentPetName).subscribe(result => {
        this.updatePetsArray();
        this.newPetName = '';
        this.newPetType = '';
      }, error => {
        console.log(error);
      });
    }
  }
}
