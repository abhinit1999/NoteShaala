fetch('https://noteshaala-six.vercel.app/')
  .then(r => r.text())
  .then(t => {
    const matches = t.match(/src="[^"]*"/g);
    if (matches) {
      console.log(matches.filter(s => s.includes('supabase')));
    }
  });
