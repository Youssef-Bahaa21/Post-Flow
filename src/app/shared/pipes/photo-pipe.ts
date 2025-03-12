import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallbackPhoto',
  standalone: true 
})
export class FallbackPhotoPipe implements PipeTransform {
  transform(photoUrl: string | null | undefined, fallback: string = 'default-avatar.png'): string {
    return photoUrl || fallback;
  }
}
