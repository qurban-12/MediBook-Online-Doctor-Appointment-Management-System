const heroIcons = [
  {
    label: 'Easy booking',
    paths: [
      'M7 10h5v5H7z',
      'M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5z'
    ]
  },
  {
    label: 'Top doctors',
    paths: [
      'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-3.33 0-6 1.67-6 3v2h12v-2c0-1.33-2.67-3-6-3z'
    ]
  },
  {
    label: 'Clear tracking',
    paths: [
      'M19 3H14l-1-1h-2l-1 1H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 8h10v2H7V8zm0 4h10v2H7v-2z'
    ]
  }
];

function HeroIcon({ label, paths }) {
  return (
    <div className="mb-home-hero-icon" aria-hidden="true">
      <svg className="mb-home-hero-icon__svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        {paths.map((path) => (
          <path key={path} fill="currentColor" d={path} />
        ))}
      </svg>
      <span className="mb-home-hero-icon__text">{label}</span>
    </div>
  );
}

export default function HomeHeroIcons() {
  return (
    <div className="d-flex flex-wrap gap-3">
      {heroIcons.map((icon) => (
        <HeroIcon key={icon.label} {...icon} />
      ))}
    </div>
  );
}