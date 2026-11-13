/**
 * gnosis house purchase handle - shim over the shared Cauldron service.
 * Unlocked by its own one-time unlock (SKUS.gnosis) or the all-access sub.
 */
import { createPurchaseService } from '../../shared/PurchaseService';
import { SKUS } from '../../shared/monetization';

export default createPurchaseService(SKUS.gnosis);
