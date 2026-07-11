import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';


interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-upcoming-events',
  imports: [CommonModule,ButtonModule,TranslatePipe],
  templateUrl: './upcoming-events.html',
  styleUrl: './upcoming-events.scss'
})
export class UpcomingEvents {
  
  events: Event[] = [
    {
        id: 1,
        title: 'Crypto Trading Summit 2024',
        date: 'March 15, 2024',
        time: '10:00 AM - 6:00 PM',
        location: 'New York Convention Center',
        description: 'Join industry leaders for insights on cryptocurrency trading, blockchain technology, and market trends.',
        category: 'Conference'
    },
    {
        id: 2,
        title: 'Blockchain Developer Workshop',
        date: 'March 22, 2024',
        time: '2:00 PM - 5:00 PM',
        location: 'San Francisco Tech Hub',
        description: 'Hands-on workshop for developers to learn smart contract development and DeFi protocols.',
        category: 'Workshop'
    },
    {
        id: 3,
        title: 'NFT Art Gallery Opening',
        date: 'March 30, 2024',
        time: '7:00 PM - 10:00 PM',
        location: 'Los Angeles Art District',
        description: 'Exclusive showcase of digital art and NFT collections from renowned artists and creators.',
        category: 'Exhibition'
    }
];
}
