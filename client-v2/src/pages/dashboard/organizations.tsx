import { useOrganizationStore } from '@/stores/organization';

export default function Organizations() {
  // TODO: Pluralize
  const { organization } = useOrganizationStore();

  console.log(organization);

  return <p>Oi!</p>;
}
