import logo from '@/assets/logo.png';
import Image from 'next/image';

type Props = {
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
};

export default function Logo({
  alt = 'Logo RNP',
  className = '',
  width = 120,
  height = 60
}: Props) {
  return (
    <Image
      src={logo}
      width={width}
      height={height}
      alt={alt}
      className={className}
    />
  );
}
