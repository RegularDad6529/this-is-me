// This is Me — PFP Board for 6529 Profiles & Wallets
// Fetches NFT holdings, displays PFP collections in a grid

const API_BASE = 'https://api.6529.io/api';
const RPC_URL = 'https://eth.drpc.org';
const IPFS_GATEWAY = 'https://dweb.link/ipfs/';

// Known PFP collections (contract address lowercase -> name)
// These are collections tracked by 6529's xTDH system that are PFP-type
const KNOWN_PFP_CONTRACTS = {
  // --- Blue chip PFPs ---
  '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb': 'CryptoPunks',
  '0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d': 'V1 Cryptopunks (Wrapped)',
  '0xb7f7f6c52f2e2bed196972b50a6c7e25b1d9f1f3': 'Wrapped CryptoPunks',
  '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': 'BoredApeYachtClub',
  '0x60e4d786628fea6478f785a6d7e704777c86a7c6': 'MutantApeYachtClub',
  '0xba30de5ba2fe1f3acd6f949a1a37b51c040fbb5f': 'Bored Ape Kennel Club',
  '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7': 'Meebits',
  '0x23581767a106921c78ca4f2971e2564a4a2904d8': 'Moonbirds',
  '0xed5af388513db9aca7c09142cde6c175e6df1a6e': 'Azuki',
  '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e': 'Doodles',

  // --- Penguin / Pudgy ecosystem ---
  '0xbd3531da5cf5857e7cfaa92426877b022e612cf8': 'PudgyPenguins',
  '0x524cab2ec69124574082676e6f654a18df49a048': 'LilPudgys',
  '0x975556c572ab933a493581ca8a25257da4e51421': 'Pudgy Rods',

  // --- RTFKT / Nike ecosystem ---
  '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b': 'CloneX',
  '0x306b1ea7ec203dd5887a4235d98c5e4ea5f3d7f1': 'Beanz (RTFKT)',

  // --- Other popular PFPs ---

  '0x1a92f7381b9f03921564a437210bb9396471050c': 'Cool Cats',
  '0x1cb1a5e65610aeff2551a50f76a87a7d3fb649c6': 'Cryptoadz',
  '0x79fcdef22feed20eddacbb2587640e45491b757f': 'mfer',
  '0x2acab3dea77832c09420663b0e1cb386031ba17b': 'DeadFellaz',
  '0xd774557b647330c91bf44cfeab205095f7e6c367': 'Nakamigos',
  '0xe785e82358879f061bc3dcac6f0444462d4b5330': 'World Of Women',
  '0xc8adfb4d437357d0a656d4e62fd9a6d22e401aa0': 'CryptoBatz by Ozzy Osbourne',
  '0x1d3ada5856b14d9df178ea5cab137d436dc55f1d': 'Deathbats Club',
  '0xf1268733c6fb05ef6be9cf23d24436dcd6e0b35e': 'Desperate ApeWives',
  '0xd37264c71e9af940e49795f0d3a8336afaafdda9': 'JungleBayApeClub',
  '0x80336ad7a747236ef41f47ed2c7641828a480baa': 'Chimpers',
  '0x9eb6e2025b64f340691e424b7fe7022ffde12438': 'Normies',
  '0x2e239070bcc69d5aab3d3245add5df15d6875638': 'XNORMIES',
  '0x03b8d129a8f6dc62a797b59aa5eebb11ad63dada': 'SMOWL',
  '0xb852c6b5892256c264cc2c888ea462189154d8d7': 'Rektguy',
  '0x54c5e045a442411390fcba60f858831e9a2d0990': 'Regular Punks',
  '0xa3f5998047579334607c47a6a2889bf87a17fc02': 'Wrapped Ether Rock',
  '0xc9d8f15803c645e98b17710a0b6593f097064bef': 'Flyfish Club',
  '0x7d0874f682c42f0fe907baf7785d9dcb5a0b1285': 'ACK PFP?',
  '0xb8ea78fcacef50d41375e44e6814ebba36bb33c4': 'Good Vibes Club',
  '0xc2c747e0f7004f9e8817db2ca4997657a7746928': 'Hashmasks',
  '0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb': 'VeeFriends',
  '0x85f740958906b317de6ed79663012859067e745b': 'TheWickedCraniums',
  '0x1bf546337e0222bfbd4f9459964494de8fea5223': 'LAST ØF US',
  '0x5af0d9827e0c53a4ed4ab95753968fe5f4a2e90a': 'Milady',
  '0xd3d9ddd0e090a51a0c9e55e34a7e4f9e4a0c7c9b': 'Remilio',
  '0x8db23d6c9aa459a2df4e778ba562f8596004c21f': 'Goblintown',
  '0x39ee2c7b3cb80254225884ca001a57417a3c9849': 'Potatoz (Memeland)',
  '0x632e5ecb531db59d1c251c7e65ab2e2a49e93f59': 'Captainz (Memeland)',
  '0x42069abfe407c60cf4ae4112bedead391dba1cdb': 'CryptoDickbutts S3',
  '0xb038c86e3293de253bdd1f800a048e2ab6e57104': 'OGs by JakNFT',
  '0xc178994cb9b66307cd62db8b411759dd36d9c2ee': 'COCKPUNCH by Tim Ferriss',
  '0xda149c88e6340118644f29039f94790722f1bbb6': 'OMbuilder',
  '0x8365382935f0fb94b9f0b07524b535ec13d35ad7': 'gristle buddeez worldwide',
  '0xee9ee1f4f3324e84e52f23c6ee9ae59e85c28a4e': 'Autocompose PFP',
  '0xc143923eddaeec04a96c43d97284612d1134e837': 'Emoji PFP',

  // --- PFPs discovered from 6529 community profiles ---
  // (Madacollects, David, Blocknoob, Arsonic, EzMonet, gpebbles)
  '0x04fdc08598f50ffb09ae9a063b04c1227a546d7e': 'Trippin Ape Tribe',
  '0x0419791b7874f7bb719acc521a4dc8f95d7880d5': 'Dusktopia',
  '0x277f448a4d43318ea626fd224b3bf77295387d68': 'SeizeTheMeebs',
  '0xd564c25b760cb278a55bdd98831f4ff4b6c97b38': 'Sugartown Oras',
  '0x387c41b0b2f1128de44db1bcf8baad085f26392c': 'Argonauts',
  '0x93a796b1e846567fe3577af7b7bb89f71680173a': 'ChainFaces Arena',
  '0x740c178e10662bbb050bde257bfa318defe3cabc': '8liens',
  '0x9a3611cc9654b8efcf458ac6d79889aa0a30ca57': 'Uldor Guardians',
  '0x585a2c37858d3b03824bc683829e4dbbf58969ee': 'CryptoJunks',
  '0x358cb4411bb8e1896efe07a50a52cc192e3c02c4': 'Noosphere Tribe',
  '0x55afd2187d7c312bf7e4ca7393a139df19f1f096': 'Low Quality Cats',
  '0x46ccb782da782b9e921dd447736ab64fc4fb2636': 'Doggo Verse',
  '0x5041a99684d38e280e4b0b356185bf18c991f88b': 'Satoshis Legions',
  '0xbe3eedda303d28e1a763106e27605247ab8e302a': 'Apemo Army',
  '0x0ceff6a7da56452e78c5dc5c492b2d0807cd4411': 'BITDAWGS',
  '0xd3cd44f07744da3a6e60a4b5fda1370400ad515b': 'Octopie (Pieland)',
  '0x6c475044bea380fb3cf93d0c9847a177fdd1c797': 'Blvck Paris',
  '0x4923017f3b7fac4e096b46e401c0662f0b7e393f': 'Buzzed Bear Hideout',
  '0x38efc0a312ac9e1ac84bb4cda061e6e043d09346': 'Berserkers',

  // --- PFPs found in RD's wallets ---
  '0x143b34034701b159e90ffb2dc2deabb822fff5b4': 'dwellers',
  '0x6bf14d09f5600ed683abce94b6c43f7cb429d308': 'dwellers (abyss)',
  '0x38793a3fdfd098e820ddf59706280681354341fc': 'BRAINROT',
  '0x2589382740f0fcca04945792688bdc210b524825': 'Twisted Tweaks',
};

// State
let config = { blocklist: [], blocklist_names: [], allowlist: [], allowlist_overrides: {}, settings: {} };
let currentProfile = null;
let allHoldings = [];
let collectionData = {};
let autoRotateTimer = null;
let allCollectionsInfo = [];

// DOM
const handleInput = document.getElementById('handle-input');
const loadBtn = document.getElementById('load-btn');
const statusEl = document.getElementById('status');
const profileInfoEl = document.getElementById('profile-info');
const boardEl = document.getElementById('board');
const emptyStateEl = document.getElementById('empty-state');
const controlsEl = document.getElementById('controls');
const autoRotateToggle = document.getElementById('auto-rotate-toggle');
const collectionFilterGroup = document.getElementById('collection-filter-group');
const collectionSearch = document.getElementById('collection-search');
const addToAllowlistBtn = document.getElementById('add-to-allowlist');
const inputModeSelect = document.getElementById('input-mode');

// --- Init ---
async function init() {
  try {
    const resp = await fetch('collections.json');
    config = await resp.json();
  } catch (e) {
    console.warn('Could not load collections.json, using defaults');
  }

  // Preload all tracked collection names
  try {
    statusEl.textContent = 'Loading collection registry...';
    let page = 1;
    while (true) {
      const resp = await fetch(`${API_BASE}/xtdh/collections?page=${page}`);
      const data = await resp.json();
      allCollectionsInfo = allCollectionsInfo.concat(data.data || []);
      if (!data.next) break;
      page++;
    }
    statusEl.textContent = '';
  } catch (e) {
    console.warn('Could not preload collection registry', e);
  }

  // Check URL params
  const params = new URLSearchParams(window.location.search);
  const handle = params.get('handle');
  const wallet = params.get('wallet');
  if (handle) {
    handleInput.value = handle;
    loadProfile(handle);
  } else if (wallet) {
    handleInput.value = wallet;
    loadWallet(wallet);
  }

  // Event listeners
  loadBtn.addEventListener('click', () => {
    const val = handleInput.value.trim().replace(/^@/, '');
    if (!val) return;
    const mode = inputModeSelect ? inputModeSelect.value : 'handle';
    if (mode === 'wallet' || /^0x[a-fA-F0-9]{40}$/.test(val)) {
      updateURL(val, 'wallet');
      loadWallet(val);
    } else {
      updateURL(val, 'handle');
      loadProfile(val);
    }
  });

  handleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadBtn.click();
  });

  if (inputModeSelect) {
    inputModeSelect.addEventListener('change', () => {
      if (inputModeSelect.value === 'wallet') {
        handleInput.placeholder = 'Enter wallet address (0x...)';
      } else {
        handleInput.placeholder = 'Enter 6529 handle (e.g. punk6529)';
      }
    });
  }

  autoRotateToggle.addEventListener('change', () => {
    if (autoRotateToggle.checked) {
      startAutoRotate();
    } else {
      stopAutoRotate();
    }
  });

  collectionSearch.addEventListener('input', () => {
    const val = collectionSearch.value.trim().toLowerCase();
    addToAllowlistBtn.disabled = !val;
  });

  addToAllowlistBtn.addEventListener('click', () => {
    const search = collectionSearch.value.trim().toLowerCase();
    if (!search) return;
    const matches = allCollectionsInfo.filter(c =>
      c.collection_name && c.collection_name.toLowerCase().includes(search)
    );
    if (matches.length === 0) {
      statusEl.textContent = `No collection matching "${search}"`;
      statusEl.className = 'status error';
      setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'status'; }, 3000);
      return;
    }
    for (const m of matches) {
      const addr = m.contract.toLowerCase();
      if (!config.allowlist.includes(addr)) {
        config.allowlist.push(addr);
      }
    }
    if (currentProfile || Object.keys(collectionData).length > 0) {
      renderBoard();
    }
    collectionSearch.value = '';
    addToAllowlistBtn.disabled = true;
    statusEl.textContent = `Added ${matches.length} collection(s): ${matches.map(m => m.collection_name).join(', ')}`;
    statusEl.className = 'status';
    setTimeout(() => { statusEl.textContent = ''; }, 4000);
  });
}

function updateURL(value, type) {
  const url = new URL(window.location);
  url.searchParams.delete('handle');
  url.searchParams.delete('wallet');
  url.searchParams.set(type, value);
  window.history.pushState({}, '', url);
}

// --- Load via 6529 Profile Handle ---
async function loadProfile(handle) {
  loadBtn.disabled = true;
  statusEl.textContent = `Looking up @${handle}...`;
  statusEl.className = 'status loading';
  profileInfoEl.style.display = 'none';
  boardEl.innerHTML = '';
  emptyStateEl.style.display = 'none';
  controlsEl.style.display = 'none';
  stopAutoRotate();
  autoRotateToggle.checked = false;

  try {
    const idResp = await fetch(`${API_BASE}/identities/${handle}`);
    if (!idResp.ok) {
      throw new Error(`Handle "${handle}" not found`);
    }
    const identity = await idResp.json();
    currentProfile = identity;
    showProfileInfo(identity);

    // Get all wallet addresses from the 6529 identity
    const wallets = (identity.wallets || []).map(w => 
      typeof w === 'string' ? w : (w.address || w.wallet || w)
    ).filter(w => w && /^0x[a-fA-F0-9]{40}$/.test(w));

    if (wallets.length === 0 && identity.primary_wallet) {
      wallets.push(identity.primary_wallet);
    }

    // Query Alchemy for each wallet to find PFP holdings
    // (6529 nft-owners API only tracks 6529-indexed collections, not external PFPs)
    statusEl.textContent = `Scanning ${wallets.length} wallet${wallets.length !== 1 ? 's' : ''} for PFPs...`;
    allHoldings = [];
    for (let i = 0; i < wallets.length; i++) {
      statusEl.textContent = `Scanning wallet ${i + 1}/${wallets.length} for PFPs...`;
      const walletHoldings = await fetchWalletNFTsOnChain(wallets[i]);
      allHoldings = allHoldings.concat(walletHoldings);
    }

    statusEl.textContent = `Found ${allHoldings.length} PFPs. Loading images...`;
    const byContract = groupByContract(allHoldings);
    const pfpCollections = filterPFPCollections(byContract);

    collectionData = {};
    for (const [contract, tokens] of Object.entries(pfpCollections)) {
      collectionData[contract] = await loadCollectionImages(contract, tokens, allHoldings);
    }

    controlsEl.style.display = 'flex';
    collectionFilterGroup.style.display = 'flex';
    renderBoard();
    statusEl.textContent = '';

  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
    statusEl.className = 'status error';
    console.error(err);
  } finally {
    loadBtn.disabled = false;
  }
}

// --- Load via Raw Wallet Address ---
async function loadWallet(address) {
  loadBtn.disabled = true;
  statusEl.textContent = `Loading wallet ${address.slice(0, 8)}...${address.slice(-6)}...`;
  statusEl.className = 'status loading';
  profileInfoEl.style.display = 'none';
  boardEl.innerHTML = '';
  emptyStateEl.style.display = 'none';
  controlsEl.style.display = 'none';
  stopAutoRotate();
  autoRotateToggle.checked = false;

  try {
    // Show profile info if this wallet is a 6529 identity
    try {
      const idResp = await fetch(`${API_BASE}/identities/by-wallet/${address}`);
      if (idResp.ok) {
        const idData = await idResp.json();
        if (idData.handle || idData.display) {
          currentProfile = idData;
          showProfileInfo(idData);
        }
      }
    } catch (e) {
      // Not a 6529 identity, that's fine
    }

    if (!currentProfile) {
      // Show minimal profile info for non-6529 wallets
      profileInfoEl.innerHTML = `
        <div class="info-text">
          <div class="info-name">${formatAddress(address)}</div>
          <div class="info-stats">Raw wallet · on-chain lookup</div>
        </div>
      `;
      profileInfoEl.style.display = 'flex';
    }

    // Always use on-chain balanceOf checks for PFP contracts
    // The 6529 nft-owners endpoint doesn't track external PFP collections
    statusEl.textContent = 'Checking PFP collections on-chain...';
    allHoldings = await fetchWalletNFTsOnChain(address);

    statusEl.textContent = `Found ${allHoldings.length} PFPs. Loading images...`;
    const byContract = groupByContract(allHoldings);
    const pfpCollections = filterPFPCollections(byContract);

    collectionData = {};
    for (const [contract, tokens] of Object.entries(pfpCollections)) {
      collectionData[contract] = await loadCollectionImages(contract, tokens, allHoldings);
    }

    controlsEl.style.display = 'flex';
    collectionFilterGroup.style.display = 'flex';
    renderBoard();
    statusEl.textContent = '';

  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
    statusEl.className = 'status error';
    console.error(err);
  } finally {
    loadBtn.disabled = false;
  }
}

// --- Fetch NFTs for a wallet via Alchemy API ---
async function fetchWalletNFTsOnChain(address) {
  const holdings = [];
  const alchemyKey = config.alchemy_api_key || 'demo';
  const alchemyBase = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}/getNFTsForOwner`;
  
  console.log(`Querying Alchemy for ${address}`);
  
  let pageKey = null;
  let totalCount = 0;
  
  while (true) {
    let url = `${alchemyBase}?owner=${address}&pageSize=100`;
    if (pageKey) url += `&pageKey=${encodeURIComponent(pageKey)}`;
    
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Alchemy API error: ${resp.status}`);
    }
    const data = await resp.json();
    
    if (!totalCount) totalCount = data.totalCount || 0;
    
    for (const nft of data.ownedNfts || []) {
      const contract = (nft.contract?.address || '').toLowerCase();
      const tokenId = nft.id?.tokenId;
      if (!contract || !tokenId) continue;
      
      // Check if this is a known PFP collection
      if (contract in KNOWN_PFP_CONTRACTS) {
        const media = nft.media?.[0] || {};
        let img = media.gateway || media.thumbnail || '';
        // For IPFS URLs, use images.weserv.nl as a CORS-friendly proxy
        if (img.startsWith('ipfs://')) {
          const cid = img.replace('ipfs://', '');
          img = 'https://images.weserv.nl/?url=' + encodeURIComponent('dweb.link/ipfs/' + cid);
        } else if (img.includes('ipfs.io/ipfs/')) {
          const path = img.replace(/^https?:\/\/ipfs\.io\/ipfs\//, '');
          img = 'https://images.weserv.nl/?url=' + encodeURIComponent('dweb.link/ipfs/' + path);
        }
        holdings.push({
          contract,
          token_id: parseInt(tokenId) || tokenId,
          balance: parseInt(nft.balance || '1'),
          image: img,
          name: nft.title || `#${tokenId}`,
          source: 'alchemy'
        });
      }
    }
    
    statusEl.textContent = `Scanned ${holdings.length} PFPs from ${totalCount} total NFTs...`;
    
    if (!data.pageKey) break;
    pageKey = data.pageKey;
  }
  
  console.log(`Found ${holdings.length} PFPs across ${new Set(holdings.map(h => h.contract)).size} collections`);
  return holdings;
}

function showProfileInfo(identity) {
  const pfp = identity.pfp || '';
  const display = identity.display || identity.handle || formatAddress(identity.primary_wallet || '');
  const level = identity.level || '?';
  const cic = identity.cic || 0;
  const walletCount = (identity.wallets || []).length;

  profileInfoEl.innerHTML = `
    ${pfp ? `<img src="${pfp}" alt="${display}" onerror="this.style.display='none'">` : ''}
    <div class="info-text">
      <div class="info-name">${display}</div>
      <div class="info-stats">Level ${level} · CIC ${cic.toLocaleString()} · ${walletCount} wallet${walletCount !== 1 ? 's' : ''}</div>
    </div>
  `;
  profileInfoEl.style.display = 'flex';
}

// --- Group & Filter ---
function groupByContract(holdings) {
  const grouped = {};
  for (const h of holdings) {
    const c = h.contract.toLowerCase();
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push({
      token_id: h.token_id,
      balance: h.balance || 1
    });
  }
  return grouped;
}

function filterPFPCollections(byContract) {
  const result = {};

  for (const [contract, tokens] of Object.entries(byContract)) {
    const isBlocked = config.blocklist.includes(contract);
    const isAllowed = config.allowlist.includes(contract);

    if (isAllowed) {
      result[contract] = tokens;
      continue;
    }

    if (isBlocked) continue;

    // Only include known PFP collections
    const isPFP = contract in KNOWN_PFP_CONTRACTS;
    if (isPFP) {
      result[contract] = tokens;
    }
  }

  return result;
}

// --- Load Images ---
async function loadCollectionImages(contract, tokens, holdings) {
  const info = {
    name: KNOWN_PFP_CONTRACTS[contract] || '',
    tokens: [],
    displayIndex: 0
  };

  // Get collection name from preloaded xTDH data if available
  const collInfo = allCollectionsInfo.find(c => c.contract.toLowerCase() === contract);
  if (collInfo?.collection_name) {
    info.name = collInfo.collection_name;
  }
  if (!info.name) info.name = formatAddress(contract);

  if (holdings && holdings.some(h => h.contract === contract && h.image)) {
    // Images already provided by Alchemy — use them, but fall back for tokens with no image
    info.tokens = tokens.map(t => {
      const h = holdings.find(h => h.contract === contract && h.token_id === t.token_id);
      return {
        id: t.token_id,
        name: h?.name || `#${t.token_id}`,
        image: h?.image || '',
        source: h?.image ? 'alchemy' : 'pending'
      };
    });
    // For any tokens with no Alchemy image, try on-chain tokenURI
    for (const token of info.tokens) {
      if (token.source === 'pending' && !token.image) {
        try {
          const img = await fetchExternalImage(contract, token.id);
          token.image = img;
          token.source = img ? 'external' : 'failed';
        } catch (e) {
          token.source = 'failed';
        }
      }
    }
    return info;
  }

  // Try 6529 API for NFT metadata (works for 6529-indexed collections)
  try {
    const resp = await fetch(`${API_BASE}/nfts?contract=${contract}&page_size=101`);
    const data = await resp.json();

    if (data.data && data.data.length > 0) {
      const nftMap = {};
      for (const n of data.data) {
        nftMap[n.id] = n;
      }

      info.tokens = tokens.map(t => {
        const nft = nftMap[t.token_id];
        const img = nft?.thumbnail || nft?.image || '';
        return {
          id: t.token_id,
          name: nft?.name || `#${t.token_id}`,
          image: img,
          source: '6529'
        };
      });
      return info;
    }
  } catch (e) {
    console.warn(`6529 API failed for ${contract}`, e);
  }

  // External collection: fetch token images via on-chain tokenURI
  info.tokens = [];
  for (const t of tokens.slice(0, 20)) {
    try {
      const img = await fetchExternalImage(contract, t.token_id);
      info.tokens.push({
        id: t.token_id,
        name: `#${t.token_id}`,
        image: img,
        source: 'external'
      });
    } catch (e) {
      info.tokens.push({
        id: t.token_id,
        name: `#${t.token_id}`,
        image: '',
        source: 'failed'
      });
    }
  }

  return info;
}

async function fetchExternalImage(contract, tokenId) {
  const tokenURISig = '0xc87b56dd';
  const tokenIdHex = tokenId.toString(16).padStart(64, '0');
  const data = tokenURISig + tokenIdHex;

  const resp = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'eth_call',
      params: [{ to: contract, data }, 'latest'],
      id: 1,
      jsonrpc: '2.0'
    })
  });

  const json = await resp.json();
  const result = json.result;

  if (!result || result === '0x' || result.length < 3) {
    // Try ERC-1155 uri(uint256)
    const uriSig = '0x0e89341c';
    const resp2 = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'eth_call',
        params: [{ to: contract, data: uriSig + tokenIdHex }, 'latest'],
        id: 2,
        jsonrpc: '2.0'
      })
    });
    const json2 = await resp2.json();
    const result2 = json2.result;
    if (!result2 || result2 === '0x' || result2.length < 3) return '';
    return await resolveTokenURI(result2, tokenId);
  }

  return await resolveTokenURI(result, tokenId);
}

async function resolveTokenURI(hexResult, tokenId) {
  const hex = hexResult.slice(2);
  if (hex.length < 128) return '';
  const length = parseInt(hex.slice(64, 128), 16) * 2;
  const uriHex = hex.slice(128, 128 + length);
  const uri = hexToString(uriHex);

  if (!uri) return '';

  let metadataUrl = uri;
  if (uri.startsWith('ipfs://')) {
    const path = uri.replace('ipfs://', '');
    metadataUrl = IPFS_GATEWAY + path;
  } else if (uri.startsWith('ipfs/')) {
    metadataUrl = IPFS_GATEWAY + uri.replace('ipfs/', '');
  }

  if (/^\d+$/.test(uri)) {
    return '';
  }

  try {
    const resp = await fetch(metadataUrl);
    const metadata = await resp.json();
    let imgUrl = metadata.image || metadata.image_url || '';

    if (imgUrl.startsWith('ipfs://')) {
      const path = imgUrl.replace('ipfs://', '');
      imgUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent('dweb.link/ipfs/' + path);
    } else if (imgUrl.startsWith('ipfs/')) {
      imgUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent('dweb.link/ipfs/' + imgUrl.replace('ipfs/', ''));
    } else if (imgUrl.includes('ipfs.io/ipfs/')) {
      imgUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent(imgUrl.replace(/^https?:\/\//, ''));
    }

    return imgUrl;
  } catch (e) {
    console.warn(`Failed to fetch metadata from ${metadataUrl}`, e);
    return '';
  }
}

function hexToString(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

// --- Render ---
function renderBoard() {
  const contracts = Object.keys(collectionData);

  if (contracts.length === 0) {
    boardEl.innerHTML = '';
    emptyStateEl.style.display = 'block';
    return;
  }

  emptyStateEl.style.display = 'none';
  boardEl.innerHTML = '';

  contracts.sort((a, b) => {
    const aAllowed = config.allowlist.includes(a);
    const bAllowed = config.allowlist.includes(b);
    if (aAllowed && !bAllowed) return -1;
    if (!aAllowed && bAllowed) return 1;
    return (collectionData[a].name || '').localeCompare(collectionData[b].name || '');
  });

  for (const contract of contracts) {
    const coll = collectionData[contract];
    if (!coll.tokens || coll.tokens.length === 0) continue;
    const card = createCard(contract, coll);
    boardEl.appendChild(card);
  }
}

function createCard(contract, coll) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.contract = contract;

  if (config.allowlist.includes(contract)) {
    card.classList.add('in-allowlist');
  }

  const token = coll.tokens[coll.displayIndex] || coll.tokens[0];
  const totalTokens = coll.tokens.length;

  const imgContainer = document.createElement('div');
  imgContainer.className = 'card-image-container';

  if (token && token.image) {
    const img = document.createElement('img');
    img.src = token.image;
    img.alt = `${coll.name} #${token.id}`;
    img.loading = 'lazy';
    img.onerror = () => {
      imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token.id}</div>`;
    };
    imgContainer.appendChild(img);
  } else {
    imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token?.id || '?'}</div>`;
  }

  const info = document.createElement('div');
  info.className = 'card-info';
  info.innerHTML = `
    <div class="card-collection">${coll.name}</div>
    <div class="card-token">
      <span>#${token?.id || '?'}</span>
      <span class="card-counter">${coll.displayIndex + 1}/${totalTokens}</span>
    </div>
  `;

  const badge = document.createElement('div');
  badge.className = 'card-allowlist-badge';
  badge.textContent = '★';

  card.appendChild(imgContainer);
  card.appendChild(info);
  card.appendChild(badge);

  card.addEventListener('click', () => {
    if (totalTokens <= 1) return;
    coll.displayIndex = (coll.displayIndex + 1) % totalTokens;
    updateCard(card, coll);
  });

  return card;
}

function updateCard(card, coll) {
  const token = coll.tokens[coll.displayIndex];
  const totalTokens = coll.tokens.length;

  const imgContainer = card.querySelector('.card-image-container');
  if (token && token.image) {
    imgContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = token.image;
    img.alt = `${coll.name} #${token.id}`;
    img.onerror = () => {
      imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token.id}</div>`;
    };
    imgContainer.appendChild(img);
  } else {
    imgContainer.innerHTML = `<div class="card-placeholder"><div class="ph-icon">🖼️</div>${coll.name}<br>#${token?.id || '?'}</div>`;
  }

  const tokenInfo = card.querySelector('.card-token');
  tokenInfo.innerHTML = `
    <span>#${token?.id || '?'}</span>
    <span class="card-counter">${coll.displayIndex + 1}/${totalTokens}</span>
  `;
}

// --- Auto Rotate ---
function startAutoRotate() {
  const interval = (config.settings?.auto_rotate_seconds || 5) * 1000;
  autoRotateTimer = setInterval(() => {
    const cards = boardEl.querySelectorAll('.card');
    cards.forEach(card => {
      const contract = card.dataset.contract;
      const coll = collectionData[contract];
      if (!coll || coll.tokens.length <= 1) return;
      coll.displayIndex = (coll.displayIndex + 1) % coll.tokens.length;
      updateCard(card, coll);
    });
  }, interval);
}

function stopAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer);
    autoRotateTimer = null;
  }
}

// --- Utils ---
function formatAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

// Start
init();