import { useOrganizationStore } from '@/stores/organization';

export default function Organizations() {
  // TODO: Pluralize
  const { organizations } = useOrganizationStore();

  console.log(organizations);

  return <p>Oi!</p>;
}
