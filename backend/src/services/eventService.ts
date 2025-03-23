export async function createEventService(event: Event): Promise<Event> {
  return await eventRepository.createEvent(event);
}