import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pokemonList: any[] = [];
  filteredPokemon: any[] = [];
  searchTerm: string = '';
  userName: string = '';
  userAvatar: string = ''; 
  showLogoutMenu: boolean = false;
  page: number = 1;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.apiService.isLoggedIn()) {
      this.router.navigate(['/']); 
      return;
    }

    const user = this.apiService.getCurrentUser();
    this.userName = user?.name || 'Usuario';
    this.userAvatar = user?.avatar || 'https://i.pravatar.cc/40'; 

    this.apiService.getPokemon().subscribe((response: any) => {
      this.pokemonList = response.results.map((pokemon: any, index: number) => ({
        id: index + 1,
        name: pokemon.name,
        image: `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemon.name.toLowerCase()}.gif`
      }));
      this.filteredPokemon = [...this.pokemonList];
    });
  }

  filterPokemon(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPokemon = this.pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(term)
    );
  }

  toggleLogoutMenu(): void {
    this.showLogoutMenu = !this.showLogoutMenu;
  }

  logout(): void {
    this.apiService.clearCurrentUser();
    this.router.navigate(['/']);
  }

  editPokemon(pokemon: any): void {
    const newName = prompt(`Editar el nombre de ${pokemon.name}:`, pokemon.name);
    if (newName && newName.trim() !== '') {
      pokemon.name = newName.trim();
      this.updateFilteredPokemon();
    }
  }

  deletePokemon(pokemon: any): void {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${pokemon.name}?`)) {
      this.pokemonList = this.pokemonList.filter(p => p.id !== pokemon.id);
      this.updateFilteredPokemon();
    }
  }

  viewDetails(pokemon: any): void {
    alert(`Detalles de: \n\nID: ${pokemon.id}\nNombre: ${pokemon.name}`);
  }

  private updateFilteredPokemon(): void {
    this.filterPokemon();
  }
}
