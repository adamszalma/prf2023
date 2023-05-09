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
}
