import { Controller } from '@nestjs/common';
import { VisitsService } from '@visits/visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}
}
