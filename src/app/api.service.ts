import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators'; // Importa map

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private currentUser: any = null; // Usuario actual
  private pokemonList: any[] = []; // Lista local de Pokémon

  constructor(private http: HttpClient) {}

  // Obtener la lista de usuarios desde la API
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('https://api.escuelajs.co/api/v1/users').pipe(
      tap((users: any[]) => {
        users.forEach((user) => {
          user.password = user.password || 'password';
        });
      })
    );
  }

  // Validar las credenciales de inicio de sesión
  validateLogin(email: string, password: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((users: any[]) => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          this.setCurrentUser(user);
          return true;
        }
        return false;
      })
    );
  }

  // Establecer el usuario actual
  setCurrentUser(user: any): void {
    this.currentUser = { ...user, avatar: user.avatar || 'https://i.imgur.com/LDOO4Qs.jpg' };
  }

  // Obtener el usuario actual
  getCurrentUser(): any {
    return this.currentUser;
  }

  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Limpiar el usuario actual (Cerrar sesión)
  clearCurrentUser(): void {
    this.currentUser = null;
  }

  // Obtener los Pokémon
  getPokemon(): Observable<any> {
    if (this.pokemonList.length === 0) {
      return this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=150').pipe(
        tap((response: any) => {
          this.pokemonList = response.results.map((pokemon: any, index: number) => ({
            id: index + 1,
            name: pokemon.name,
            image: `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemon.name.toLowerCase()}.gif`,
          }));
        })
      );
    } else {
      return of({ results: this.pokemonList });
    }
  }
}
